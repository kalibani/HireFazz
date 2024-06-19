'use client';
import { Loader } from '@/components/share';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslate } from '@/hooks/use-translate';
import { TEmail, sendingEmail } from '@/lib/actions/email';
import { TDetailJobTableProps } from '@/lib/actions/job/getJob';
import { useStoreEmail } from '@/zustand/useStoreEmail';
import { Mails } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const DetailJobSendEmail: FC<TDetailJobTableProps> = ({ jobDetail }) => {
  const { ids } = useStoreEmail((state) => state);
  const selectedCv = jobDetail?.data?.cvAnalysis?.filter((x) =>
    ids.includes(x.id),
  );
  const t = useTranslations('JobDetail');
  const { language } = useTranslate();
  const form = useForm<
    TEmail & { cc?: string; bcc?: string; attachJobDescription?: string }
  >();
  const cc = form.watch('cc');
  const bcc = form.watch('bcc');
  const emailContent = useMemo(() => {
    if (language === 'en') {
      return `
        Dear {{CANDIDATE_FIRST_NAME}}, <br/> We hope this email finds you well. We are pleased to inform you that after careful consideration of your application and interview performance, you have been shortlisted for the {{JOB_TITLE}} position at {{JOB_COMPANY}}. Your qualifications and experience stood out and we believe that your skills align well with the requirements of the role. We feel confident that your contributions would greatly benefit our team. Congratulations on reaching this stage, and we look forward to the possibility of welcoming you to our team. Best regards,
        <br/>
        ${cc ? `CC: ${cc}` : ''}
        <br/>
        ${bcc ? `BCC: ${bcc}` : ''}
        `;
    } else {
      return `Kepada {{CANDIDATE_FIRST_NAME}}, <br/><br/>
  
        Kami berharap email ini menemukan Anda dalam keadaan baik. Kami dengan senang hati menginformasikan bahwa setelah mempertimbangkan dengan cermat aplikasi dan kinerja wawancara Anda, Anda telah terpilih untuk posisi {{JOB_TITLE}} di {{JOB_COMPANY}}. Kualifikasi dan pengalaman Anda menonjol dan kami percaya bahwa keterampilan Anda sangat sesuai dengan persyaratan peran ini. Kami yakin bahwa kontribusi Anda akan sangat bermanfaat bagi tim kami.`;
    }
  }, [cc, bcc, language]);
  const receiver = selectedCv?.map((x) => x.reportOfAnalysis?.email) || [,];
  const [value, setValue] = useState(emailContent);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    const res = await sendingEmail({
      ...data,
      to: selectedCv?.map((x) => x.reportOfAnalysis?.email) || [],
      html: value,
    });
    setIsLoading(false);
  });
  useEffect(() => {
    setValue(emailContent);
  }, [cc, bcc, language]);
  return (
    <section className="flex flex-col gap-y-12 py-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-[16px] font-semibold text-black">
          {t('actionSendEmail')}
        </h1>
        <div className="flex gap-x-2">
          <p className="text-sm text-black">{t('sendTo')}: </p>
          {receiver.map((receiver, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded border border-gray-300 px-2 text-xs text-slate-400"
            >
              {receiver}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h1 className="text-[16px] font-semibold text-black">
          {t('configureEmail')}
        </h1>
        <div className="flex w-full gap-x-4">
          <ReactQuill
            //@ts-ignore
            theme="snow"
            value={value}
            onChange={setValue}
            className="h-[260px] w-1/2"
          />
          <div className="flex w-1/2 flex-col">
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="flex w-full flex-col gap-y-4"
              >
                <div className="flex w-full gap-x-3">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>{t('emailFrom')} *</FormLabel>
                        <FormControl>
                          <Input required placeholder="From" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>{t('emailReply')} :</FormLabel>
                        <FormControl>
                          <Input required placeholder="Reply to" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full gap-x-3">
                  <FormField
                    control={form.control}
                    name="cc"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>CC</FormLabel>
                        <FormControl>
                          <Input placeholder="CC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bcc"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>BCC</FormLabel>
                        <FormControl>
                          <Input placeholder="BCC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t('emailSubject')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Subject Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachJobDescription"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-4">
                      <FormLabel className="mt-2">
                        {t('emailAttachDescJob')}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          orientation="horizontal"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center justify-center gap-x-2"
                        >
                          <FormItem className="flex items-center justify-center gap-x-2">
                            <FormControl>
                              <RadioGroupItem value={'Yes'} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              {t('yes')}
                            </span>
                          </FormItem>
                          <FormItem className="flex items-center justify-center gap-x-2">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              {t('no')}
                            </span>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 
                NOTE: Commented because not ready yet feature
                <div className="flex w-full flex-col gap-y-3">
                  <FormLabel className="text-sm">Placeholders :</FormLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      CANDIDATE_FIRST_NAME
                    </div>
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      CANDIDATE_LAST_NAME
                    </div>
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      CANDIDATE_FULL_NAME
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-y-3">
                  <FormLabel className="text-sm">Links :</FormLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      ACCEPT_LINK
                    </div>
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      REJECT_LINK
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      Add Link +
                    </span>
                  </div>
                </div>
                */}
                <div className="mt-6 flex items-center gap-x-4">
                  <Button type="submit" className="flex gap-x-2">
                    <Mails /> {t('actionSendEmail')}
                  </Button>
                  <span
                    onClick={() => form.reset()}
                    className="text-xs font-medium text-black underline"
                  >
                    {t('reset')}
                  </span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 h-full w-full items-start justify-center rounded-lg bg-black bg-opacity-40">
          <Loader />
        </div>
      )}
    </section>
  );
};

export default DetailJobSendEmail;
