const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "John Doe",
        email: "john@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "John Doel",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Guest User",
        email: "guest@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Anthony",
        email: "anthony@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Anthony",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "jon@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Friends",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Jane Doe",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "jon@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Chill Zone",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Emily Stone",
        email: "emily@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617b1234abc123456789abcd",
    chatName: "Emily",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Sarah Lee",
        email: "sarah@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617b2234abc123456789abcd",
    chatName: "Sarah",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Mark Spencer",
        email: "mark@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Alex Johnson",
        email: "alex@example.com",
      },
    ],
    _id: "617c2234abc123456789abcd",
    chatName: "Work Team",
    groupAdmin: {
      name: "Mark Spencer",
      email: "mark@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Oliver King",
        email: "oliver@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "617d1234abc123456789abcd",
    chatName: "Oliver",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Emily Stone",
        email: "emily@example.com",
      },
      {
        name: "Sarah Lee",
        email: "sarah@example.com",
      },
      {
        name: "John Doe",
        email: "john@example.com",
      },
    ],
    _id: "617e1234abc123456789abcd",
    chatName: "Study Group",
    groupAdmin: {
      name: "Piyush",
      email: "piyush@example.com",
    },
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Admin",
        email: "admin@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Random User",
        email: "random@example.com",
      },
    ],
    _id: "617f1234abc123456789abcd",
    chatName: "Admin Discussion",
    groupAdmin: {
      name: "Admin",
      email: "admin@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Lucas Green",
        email: "lucas@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "61801234abc123456789abcd",
    chatName: "Lucas",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
      {
        name: "Emily Stone",
        email: "emily@example.com",
      },
      {
        name: "Oliver King",
        email: "oliver@example.com",
      },
      {
        name: "John Doe",
        email: "john@example.com",
      },
    ],
    _id: "61811234abc123456789abcd",
    chatName: "Weekend Plans",
    groupAdmin: {
      name: "Emily Stone",
      email: "emily@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Nina Davis",
        email: "nina@example.com",
      },
      {
        name: "Piyush",
        email: "piyush@example.com",
      },
    ],
    _id: "61821234abc123456789abcd",
    chatName: "Nina",
  },
];

module.exports = { chats };
