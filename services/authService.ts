
import type { User } from '../types';

const USERS_KEY = 'mindscribe-users';

// NOTE: This is a placeholder for a real hashing function.
// In a production app, use a library like bcrypt.
const simpleHash = (password: string) => btoa(password);

const getUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const migrateDataToUser = (userId: string) => {
    console.log(`Migrating data for new user ${userId}`);
    const oldThoughtsKey = 'mindscribe-thoughts';
    const oldTasksKey = 'mindscribe-tasks';

    const oldThoughts = localStorage.getItem(oldThoughtsKey);
    if (oldThoughts) {
        localStorage.setItem(`mindscribe-thoughts-${userId}`, oldThoughts);
        localStorage.removeItem(oldThoughtsKey);
        console.log("Migrated thoughts.");
    }

    const oldTasks = localStorage.getItem(oldTasksKey);
    if (oldTasks) {
        localStorage.setItem(`mindscribe-tasks-${userId}`, oldTasks);
        localStorage.removeItem(oldTasksKey);
        console.log("Migrated tasks.");
    }
};

export const authService = {
  signup: async (email: string, password: string): Promise<User> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate async
    const users = getUsers();

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }

    const isFirstUser = users.length === 0;

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    if (isFirstUser) {
        migrateDataToUser(newUser.id);
    }
    
    users.push(newUser);
    saveUsers(users);

    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate async
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.passwordHash !== simpleHash(password)) {
      throw new Error("Invalid email or password.");
    }

    return user;
  },

  getUserById: (userId: string): User | undefined => {
      const users = getUsers();
      return users.find(u => u.id === userId);
  }
};
