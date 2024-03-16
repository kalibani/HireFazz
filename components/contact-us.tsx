'use client';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { Mail, MessagesSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

function Contact() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth <= 640;
    setIsMobile(isMobile);
  }, []);
  const form = useRef();
  const submitNotification = (error = '', toastHandler = toast) => {
    if (error) {
      toastHandler.error(`Failed to sent message: ${error}`, {
        style: {
          background: '#eb4034',
          color: '#fff',
          maxWidth: 500,
        },
      });
    } else {
      toastHandler.success(`Successfully sent message`, {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      });
    }
  };

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID!,
        form.current!,
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY
      )
      .then(
        () => {
          submitNotification();
        },
        (error) => {
          submitNotification(error?.text);
        }
      )
      .finally(() => {
        // @ts-ignore
        e.target.reset();
      });
  };

  return (
    <section className="py-10 sm:pt-16 md:pt-16 text-white" id="contact">
      <Toaster position="top-right" reverseOrder={false} />
      <h5
        className={cn('text-center text-4xl font-extrabold mb-10', {
          // 'text-white': !isSignedIn,
          // 'text-[#192339]': isSignedIn,
        })}
      >
        Get in Touch
      </h5>
      <div className="container w-[90%] md:w-[78%] grid grid-cols-1 md:grid-cols-[30%,50%] gap-8 md:gap-[12%] m-auto">
        <div className="flex flex-col gap-[1.2rem]">
          <article className="bg-[#192339] p-[1.2rem] rounded-[1.2rem] text-center border-[1px] border-solid border-transparent transition delay-150 duration-300 ease-in-out hover:border-[#192339]">
            <Mail className="inline-block text-2xl mb-2" />
            <h4>Email</h4>
            <h5>contact@berrytrada.com</h5>
            <a
              href="mailto:contact@berrytrada.com"
              target="_blank"
              className="text-[#4db5ff] transition delay-150 duration-300 ease-in-out hover:text-white mt-3 inline-block text-xs"
            >
              Send a Message
            </a>
          </article>
          {/* <article className="bg-[#192339] p-[1.2rem] rounded-[1.2rem] text-center border-[1px] border-solid border-transparent transition delay-150 duration-300 ease-in-out hover:border-[#4db5ff66]">
            <RiMessengerLine className="inline-block text-2xl mb-2" />
            <h4>Messenger</h4>
            <h5>kautzaralibani</h5>
            <a
              href="https://m.me/kautzaralibani"
              target="_blank"
              className="text-[#4db5ff] transition delay-150 duration-300 ease-in-out hover:text-white inline-block mt-3 inline-block text-xs"
            >
              Send a Message
            </a>
          </article> */}
          <article className="bg-[#192339] p-[1.2rem] rounded-[1.2rem] text-center border-[1px] border-solid border-transparent transition delay-150 duration-300 ease-in-out hover:border-[#192339]">
            <MessagesSquare className="inline-block text-2xl mb-2" />
            <h4>Whatsapp</h4>
            <h5>+6282126753060</h5>
            <a
              href={
                isMobile
                  ? 'https://api.whatsapp.com/send?phone=+6282126753060'
                  : 'https://web.whatsapp.com/send?phone=+6282126753060'
              }
              target="_blank"
              className="text-[#4db5ff] transition delay-150 duration-300 ease-in-out hover:text-white mt-3 inline-block text-xs"
            >
              Send a Message
            </a>
          </article>
        </div>
        <form
          // @ts-ignore
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col gap-[1.2rem]"
        >
          <input
            className={cn(
              'w-full p-6 rounded-lg bg-[transparent] border-[2px] border-solid border-[#4db5ff66] focus:outline-none  focus:border-primary resize-none',
              {
                // 'text-[#192339]': isSignedIn,
              }
            )}
            type="text"
            name="name"
            placeholder="Your Name"
            required
          />
          <input
            className={cn(
              'w-full p-6 rounded-lg bg-[transparent] border-[2px] border-solid border-[#4db5ff66] focus:outline-none  focus:border-primary resize-none',
              {
                // 'text-[#192339]': isSignedIn,
              }
            )}
            type="email"
            name="email"
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            rows={7}
            placeholder="Your Message"
            required
            className={cn(
              'w-full p-6 rounded-lg bg-[transparent] border-[2px] border-solid border-[#4db5ff66] focus:outline-none  focus:border-primary resize-none',
              {
                // 'text-[#192339]': isSignedIn,
              }
            )}
          ></textarea>
          <Button type="submit">Send Message</Button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
