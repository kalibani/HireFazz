'use client';

import React, { FC, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from '../ui/form';
import { Input } from '../ui/input';
import Image from 'next/image';
import Logo from '@/public/BerryLabs.png';
import Link from 'next/link';

import checkingOtpCandidate from '@/lib/actions/candidate/checkingOtpCandidate';
import toast from 'react-hot-toast';
import { Loader } from '../share';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const FormSchema = z.object({
  otp: z.string().min(4, {
    message: 'masukan kode 4 karakter dari email anda',
  }),
});

const FormOtp: FC<{ id: string }> = ({ id }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(() => {
      checkingOtpCandidate(data.otp, id)
        .then((data) => {
          //@ts-ignore
          data && toast.success(data?.success);
        })
        .catch((error) => toast.error(error.error))
        .finally(() => {
          const params = new URLSearchParams(searchParams);

          params.set('open', `${id}open`);

          replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    });
  };
  return (
    <>
      <div className="flex h-[600px] w-[600px] flex-col items-center justify-center rounded-2xl border bg-white p-4">
        <Link href="/">
          <div className="flex items-end gap-x-1">
            <Image src={Logo} alt="logo" width={30} />
            <h4 className="text-sm font-semibold">berrylabs.io</h4>
          </div>
        </Link>
        <h1 className="my-4 text-2xl font-bold">Masukan Code Anda</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 items-center space-y-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="my-6 flex w-full flex-col items-center justify-center text-center">
                  <FormLabel className="text-muted-foreground">
                    code hanya sekali pakai
                  </FormLabel>
                  <FormControl className="w-full">
                    <Input
                      {...field}
                      maxLength={4}
                      className="mx-auto w-1/2 text-center text-2xl font-semibold"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormDescription>
                    Mohon masukan code dari email yang dikirim.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" variant="default">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      {isPending && <Loader />}
    </>
  );
};

export default FormOtp;
