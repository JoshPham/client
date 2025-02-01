import * as z from "zod";

export const LoginSchema = z.object({
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const codeSchema = z.object({
    code: z.string().nullable()
});

export const joinSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }).max(10, {
        message: "Name must be less than 10 characters",
    }),
});