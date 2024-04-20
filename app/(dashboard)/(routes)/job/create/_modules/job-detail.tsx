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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC, ReactElement } from 'react';
import { useForm } from 'react-hook-form';

const currencyTypes = ['IDR', 'USD', 'EUR', 'CAD', 'GBP', 'AUD', 'JPY', 'CHF'];

export const JobDetailModule: FC = (): ReactElement => {
  const form = useForm();
  return (
    <section className="flex w-full flex-col items-center gap-y-16">
      <h1 className="text-2xl font-medium">Create Job Details</h1>
      <div className="w-1/2">
        <Form {...form}>
          <form className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row gap-x-4">
              <FormField
                control={form.control}
                name="averageSallary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avarage Sallary (per month)</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyTypes.map((item, key) => (
                            <SelectItem key={key} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="From" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="To" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full flex-row gap-x-4">
              <FormField
                control={form.control}
                name="minExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Experience (year)</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Min Experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyTypes.map((item, key) => (
                            <SelectItem key={key} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Model</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Work Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyTypes.map((item, key) => (
                            <SelectItem key={key} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              <Button className="w-fit">Next</Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};
