import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
  const prisma = new PrismaClient({ adapter } as any);

  await prisma.$connect();

  const services = [
    { title: "Haircut - Men's Classic", description: "Traditional men's haircut with styling", duration: 30, price: 25.0 },
    { title: "Haircut - Women's Trim", description: "Women's hair trim and finish", duration: 45, price: 40.0 },
    { title: "Haircut - Kids", description: "Fun and quick haircut for children", duration: 20, price: 18.0 },
    { title: "Haircut - Buzz Cut", description: "Clean buzz cut finish", duration: 15, price: 15.0 },
    { title: "Haircut - Beard Trim", description: "Beard shaping and trim", duration: 20, price: 20.0 },
    { title: "Haircut - Full Service", description: "Haircut plus beard trim and hot towel", duration: 60, price: 45.0 },
    { title: "Haircut - Bangs Trim", description: "Quick bangs and fringe trim", duration: 15, price: 12.0 },
    { title: "Haircut - Senior Discount", description: "Classic haircut for seniors", duration: 30, price: 20.0 },
    { title: "Massage - Swedish", description: "Relaxing full-body Swedish massage", duration: 60, price: 80.0 },
    { title: "Massage - Deep Tissue", description: "Intensive deep tissue massage", duration: 60, price: 90.0 },
    { title: "Massage - Hot Stone", description: "Therapeutic hot stone massage", duration: 75, price: 110.0 },
    { title: "Massage - Aromatherapy", description: "Calming aromatherapy massage", duration: 60, price: 85.0 },
    { title: "Massage - Sports", description: "Sports injury recovery massage", duration: 45, price: 70.0 },
    { title: "Massage - Prenatal", description: "Gentle prenatal massage", duration: 60, price: 75.0 },
    { title: "Massage - Reflexology", description: "Foot reflexology session", duration: 30, price: 50.0 },
    { title: "Massage - Couples", description: "Side-by-side couples massage", duration: 60, price: 160.0 },
    { title: "Cleaning - Standard Home", description: "Standard home cleaning", duration: 120, price: 100.0 },
    { title: "Cleaning - Deep Clean", description: "Deep clean of entire home", duration: 180, price: 180.0 },
    { title: "Cleaning - Office", description: "Office space cleaning", duration: 60, price: 80.0 },
    { title: "Cleaning - Move In/Out", description: "Move-in or move-out cleaning", duration: 240, price: 300.0 },
    { title: "Cleaning - Window Washing", description: "Interior and exterior window washing", duration: 90, price: 120.0 },
    { title: "Cleaning - Carpet Shampoo", description: "Professional carpet shampoo", duration: 120, price: 150.0 },
    { title: "Tutoring - Math K-8", description: "Elementary and middle school math", duration: 60, price: 40.0 },
    { title: "Tutoring - Math High School", description: "Algebra, geometry, calculus", duration: 60, price: 50.0 },
    { title: "Tutoring - English", description: "Reading, writing, and grammar", duration: 60, price: 45.0 },
    { title: "Tutoring - Science", description: "Biology, chemistry, physics", duration: 60, price: 50.0 },
    { title: "Tutoring - Test Prep", description: "SAT, ACT, and exam prep", duration: 90, price: 70.0 },
    { title: "Tutoring - Coding Basics", description: "Intro to programming for beginners", duration: 60, price: 55.0 },
    { title: "Personal Training - Intro Session", description: "First-time personal training", duration: 45, price: 40.0 },
    { title: "Personal Training - Standard", description: "Standard personal training session", duration: 60, price: 65.0 },
  ];

  await prisma.service.createMany({
    data: services.map((s) => ({
      title: s.title,
      description: s.description,
      duration: s.duration,
      price: s.price,
    })),
  });

  const allServices = await prisma.service.findMany();
  const statuses: Array<"PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"> = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ];

  const firstNames = [
    "Alice",
    "Bob",
    "Carol",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Kate",
    "Liam",
    "Mia",
    "Noah",
    "Olivia",
    "Paul",
    "Quinn",
    "Rachel",
    "Sam",
    "Tina",
    "Uma",
    "Victor",
    "Wendy",
    "Xander",
    "Yara",
    "Zane",
    "Aaron",
    "Bianca",
    "Carlos",
    "Diana",
    "Ethan",
    "Fiona",
    "George",
    "Hannah",
    "Ian",
    "Julia",
    "Kevin",
    "Laura",
    "Michael",
    "Nina",
    "Oscar",
    "Patricia",
    "Quentin",
    "Rose",
    "Steven",
    "Teresa",
    "Ulrich",
    "Violet",
    "William",
  ];

  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "example.com",
    "mail.com",
  ];

  const bookings: any[] = [];

  for (let i = 0; i < 50; i++) {
    const service = allServices[i % allServices.length];
    const firstName = firstNames[i % firstNames.length];
    const domain = domains[i % domains.length];
    const status = statuses[i % statuses.length];

    const date = new Date();
    date.setDate(date.getDate() + ((i * 3) % 30));

    const timeHour = 8 + (i % 12);
    const timeMinute = (i * 7) % 60;
    const timeString = `${String(timeHour).padStart(2, "0")}:${String(timeMinute).padStart(2, "0")}`;

    const booking: any = {
      customerName: `${firstName} ${["Smith", "Johnson", "Lee", "Patel", "Garcia"][i % 5]}`,
      customerEmail: `${firstName.toLowerCase()}${i}@${domain}`,
      customerPhone: `+1-555-01${String(i).padStart(2, "0")}`,
      serviceId: service.id,
      bookingDate: date,
      bookingTime: timeString,
      status,
    };
    if (i % 3 === 0) {
      booking.notes = "Please bring ID.";
    }
    bookings.push(booking);
  }

  await prisma.booking.createMany({
    data: bookings,
  });

  console.log("Seed completed: 30 services and 50 bookings inserted.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
