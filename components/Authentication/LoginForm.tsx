"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";

const schema = z.object({
  username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data);
      console.log("Login Response:", res); 

      
      const token = res.data?.token;

      if (!token) {
        throw new Error("توکن از سرور دریافت نشد");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      toast.success("ورود موفقیت‌آمیز بود ");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "خطا در ورود ");
      console.error("Login Error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <div>
        <label className="block mb-1">نام کاربری</label>
        <input
          type="text"
          {...register("username")}
          className="border px-3 py-2 w-full rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">رمز عبور</label>
        <input
          type="password"
          {...register("password")}
          className="border px-3 py-2 w-full rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "در حال ارسال..." : "ورود"}
      </button>
    </form>
  );
}
