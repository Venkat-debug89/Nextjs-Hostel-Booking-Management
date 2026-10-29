"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { demoAdmin } from "@/data/initialData";
import { clearStorage, readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";
import { useHostel } from "@/context/HostelContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { users, registerStudent } = useHostel();
  const [user, setUser] = useState(null);
  const [registeredPasswords, setRegisteredPasswords] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setUser(readStorage(STORAGE_KEYS.session, null));
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (user) writeStorage(STORAGE_KEYS.session, user);
    else clearStorage(STORAGE_KEYS.session);
  }, [user, ready]);

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === "admin@hostelhub.com" && password === "admin123") {
      setUser(demoAdmin);
      return { ok: true, destination: "/admin/dashboard" };
    }
    if (normalizedEmail === "student@gmail.com" && password === "student123") {
      const student = users.find((item) => item.email === normalizedEmail);
      if (student) {
        setUser(student);
        return { ok: true, destination: "/student/dashboard" };
      }
    }
    if (registeredPasswords[normalizedEmail] === password) {
      const student = users.find((item) => item.email.toLowerCase() === normalizedEmail);
      if (student) {
        setUser(student);
        return { ok: true, destination: "/student/dashboard" };
      }
    }
    return { ok: false, error: "Email or password is incorrect." };
  }

  function register(details) {
    const result = registerStudent(details);
    if (result.ok) {
      setRegisteredPasswords((current) => ({ ...current, [result.user.email.toLowerCase()]: details.password }));
      setUser(result.user);
    }
    return result;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, authenticated: Boolean(user), ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}