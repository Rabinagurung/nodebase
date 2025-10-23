"use client";

import { zodResolver } from '@hookform/resolvers/zod'; 
import Image from 'next/image';
import {  useForm } from "react-hook-form"; 
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import z from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { da } from 'date-fns/locale';



const registerFormSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"), 
    confirmPassword: z.string().min(8, "Password must be at least 8 characters")
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match", 
    path: ["confirmPassword"]
})


const RegisterForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: "", 
            password: "", 
            confirmPassword: ""
        }
    })

    const onSubmit = async(data: z.infer<typeof registerFormSchema>) => {
        await authClient.signUp.email(
            {
                name: data.email, 
                email: data.email, 
                password: data.password, 
                callbackURL: "/"
            }, 
            {
                onSuccess: () =>{
                    router.push("/");
                }, 
                onError: (ctx) =>{
                    toast.error(ctx.error.message);
                }
            }
        )
    }

  return (
    <div className='flex flex-col gap-6'>
        <Card>
            <CardHeader className='text-center'>
                <CardTitle>Get started</CardTitle>
                <CardDescription>Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid gap-6'>
                            <div className='flex flex-col gap-6'>
                                <Button
                                    variant="outline"
                                    type='button'
                                    className='w-full'
                                    disabled={form.formState.isSubmitting}
                                >
                                    Continue with Github
                                </Button>
                                 <Button
                                    variant="outline"
                                    type='button'
                                    className='w-full'
                                    disabled={form.formState.isSubmitting}
                                >
                                    Continue with Google
                                </Button>
                            </div>
                            <div className='grid gap-6 '>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='abc@gmail.com'
                                                {...field}
                                            />  
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='********'
                                                {...field}
                                            />  
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='********'
                                                {...field}
                                            />  
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type='submit'
                                className='w-full'
                                disabled={form.formState.isSubmitting}
                            >
                                Sign Up
                            </Button>
                            </div>
                            <div className='text-center text-sm'>
                                Already have an account ? {" "}
                                <Link 
                                    href="/login" 
                                    className='underline underline-offset-4'
                                >Login</Link> 
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}

export default RegisterForm