import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting tables...");
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  await prisma.user.create({
    data: {
      email: "librarian@plp.dev",
      name: "Chief Librarian",
      role: Role.LIBRARIAN,
    },
  });

  await prisma.user.create({
    data: {
      email: "patron@plp.dev",
      name: "John Patron",
      role: Role.PATRON,
    },
  });

  console.log("Seeding genres...");
  const sciFi = await prisma.genre.create({
    data: {
      name: "Science Fiction",
      description: "Futuristic and technological tales",
    },
  });
  const fantasy = await prisma.genre.create({
    data: {
      name: "Fantasy",
      description: "Magic, worlds, and mythical creatures",
    },
  });
  const mystery = await prisma.genre.create({
    data: {
      name: "Mystery",
      description: "Crime, puzzles, and thriller plots",
    },
  });
  const nonFiction = await prisma.genre.create({
    data: {
      name: "Non-Fiction",
      description: "Real-world science and history",
    },
  });

  console.log("Seeding books...");
  await prisma.book.createMany({
    data: [
      {
        title: "Dune",
        author: "Frank Herbert",
        isbn: "978-0441172719",
        genreId: sciFi.id,
      },
      {
        title: "Neuromancer",
        author: "William Gibson",
        isbn: "978-0441569595",
        genreId: sciFi.id,
      },
      {
        title: "Foundation",
        author: "Isaac Asimov",
        isbn: "978-0553293357",
        genreId: sciFi.id,
      },
      {
        title: "Snow Crash",
        author: "Neal Stephenson",
        isbn: "978-0553380958",
        genreId: sciFi.id,
      },

      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "978-0547928227",
        genreId: fantasy.id,
      },
      {
        title: "A Game of Thrones",
        author: "George R.R. Martin",
        isbn: "978-0553593716",
        genreId: fantasy.id,
      },
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        isbn: "978-0756404741",
        genreId: fantasy.id,
      },
      {
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        isbn: "978-0765365279",
        genreId: fantasy.id,
      },

      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        isbn: "978-0307474278",
        genreId: mystery.id,
      },
      {
        title: "Gone Girl",
        author: "Gillian Flynn",
        isbn: "978-0307588371",
        genreId: mystery.id,
      },
      {
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        isbn: "978-0307949486",
        genreId: mystery.id,
      },
      {
        title: "And Then There Were None",
        author: "Agatha Christie",
        isbn: "978-0062073488",
        genreId: mystery.id,
      },

      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        isbn: "978-0062316097",
        genreId: nonFiction.id,
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "978-0735211292",
        genreId: nonFiction.id,
      },
      {
        title: "Educated",
        author: "Tara Westover",
        isbn: "978-0399590504",
        genreId: nonFiction.id,
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        isbn: "978-0374533557",
        genreId: nonFiction.id,
      },
    ],
  });

  console.log("Seeding completed: 4 genres, 16 books.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
