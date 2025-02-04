// import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
// import type { Session } from "@/lib/auth";
import { generateToken } from "./lib/deviceId";
// import getAdmin from "./db-access/session";

const publicRoutes = ["", "join", "game", "learn-more", "citations"];
const authRoutes = ["/auth"];
const passwordRoutes = ["/reset-password", "/forgot-password"];

const attachDeviceId = (request: NextRequest, response: NextResponse): NextResponse => {
    const deviceId = request.cookies.get("deviceId");
    if (!deviceId) {
        response.cookies.set({
            name: "deviceId",
            value: generateToken(),
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
        });
    }
    return response;
};

export default async function authMiddleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const pathSplit = pathName.split("/");
    const pathRoot = pathSplit[1];
    const isPublicRoute = publicRoutes.includes(pathName) || publicRoutes.includes(pathRoot);
    const isAuthRoute = authRoutes.includes(pathName);
    const isPasswordRoute = passwordRoutes.includes(pathName);

    const response = attachDeviceId(request, NextResponse.next());

    // const { data: session } = await betterFetch<Session>(
    //     "/api/auth/get-session", 
    //     {
    //     baseURL: process.env.BETTER_AUTH_URL,
    //     headers: {
    //         cookie: request.headers.get("cookie") || "",
    //     },
    //     },
    // );
    // const session = await getAdmin();
    // const session = null;
    // console.log("middleware")
    const adminStatusResponse = await fetch(`${request.nextUrl.origin}/api/get-admin`, {
        headers: { cookie: request.headers.get("cookie") || "" },
    });
    const { isAdmin } = await adminStatusResponse.json();
    if (!isAdmin) {
        if (isAuthRoute || isPasswordRoute) {
            return response;
        }
        if (!isPublicRoute) {
            // return attachDeviceId(request, NextResponse.redirect(new URL("/", request.url)));
            return attachDeviceId(request, NextResponse.redirect(new URL("/", request.url)));
        }
    }
    if (pathName === "/" && isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAuthRoute || isPasswordRoute) {
        return attachDeviceId(request, NextResponse.redirect(new URL("/", request.url)));
    }

//   if (isAdminRoute && session.user.role !== "admin") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

  return response;
}

export const config = {
    matcher: [
      "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|mp4|webm|css|js|json)).*)",
    ],
}