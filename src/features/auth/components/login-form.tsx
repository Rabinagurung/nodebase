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


const loginFormSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"), 
})

const LoginForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "", 
            password: ""
        }
    })

    const onSubmit = async(data: z.infer<typeof loginFormSchema>) => {
        await authClient.signIn.email({
            email:  data.email, 
            password: data.password, 
            callbackURL: "/"
        }, 
        {
            onSuccess: () =>{
                router.push("/");
            }, 
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        }, 
    )}

  return (
    <div className='flex flex-col gap-6'>
        <Card>
            <CardHeader className='text-center'>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Login to complete</CardDescription>
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
                                    <Image alt='github image' src="/logos/github.svg" width={20} height={20}/>
                                    Continue with Github
                                </Button>
                                 <Button
                                    variant="outline"
                                    type='button'
                                    className='w-full'
                                    disabled={form.formState.isSubmitting}
                                >
                                    <Image alt='google image' src="/logos/google.svg" width={20} height={20}/>
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
                            <Button 
                                type='submit'
                                className='w-full'
                                disabled={form.formState.isSubmitting}
                            >
                                Login
                            </Button>
                            </div>
                            <div className='text-center text-sm'>
                                Don&apos;t have an account ? {" "}
                                <Link 
                                    href="/signup" 
                                    className='underline underline-offset-4'
                                >Sign up</Link> 
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}

export default LoginForm