import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { Prisma, BookingStatus } from '../../generated/prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const { serviceId, bookingDate, bookingTime } = createBookingDto;

    // Check if service exists
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Check if booking date is in the past
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    if (bookingDateTime < new Date()) {
      throw new BadRequestException('Booking dates cannot be in the past');
    }

    // Check for duplicates (same service, date and time)
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        serviceId,
        bookingDate: new Date(bookingDate),
        bookingTime,
      },
    });

    if (existingBooking) {
      throw new ConflictException('This time slot is already booked for this service');
    }

    return this.prisma.booking.create({
      data: {
        customerName: createBookingDto.customerName,
        customerEmail: createBookingDto.customerEmail,
        customerPhone: createBookingDto.customerPhone,
        serviceId: createBookingDto.serviceId,
        bookingDate: new Date(createBookingDto.bookingDate),
        bookingTime: createBookingDto.bookingTime,
        notes: createBookingDto.notes,
      },
    });
  }

  async findAll(query: QueryBookingDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.serviceId) {
      where.serviceId = query.serviceId;
    }
    if (query.date) {
      where.bookingDate = new Date(query.date);
    }
    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: { service: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED && updateBookingStatusDto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: updateBookingStatusDto.status },
    });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
