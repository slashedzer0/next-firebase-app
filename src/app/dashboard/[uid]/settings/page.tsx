"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  firstName: z.string().min(0).optional(),
  lastName: z.string().min(0).optional(),
  email: z.string().optional(),
  nim: z.string().min(0).min(8).optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserDashboardSettingsPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "student@example.ac.id",
      nim: "",
      phone: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      console.log(values);
      // Simple alert instead of toast
      alert(JSON.stringify(values, null, 2));
    } catch (error) {
      console.error("Form submission error", error);
      alert("Failed to submit the form. Please try again.");
    }
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Card className="bg-background">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="grid w-full md:block">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 md:w-2/3"
                >
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder=""
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder=""
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+62" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Save changes</Button>
                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
}
