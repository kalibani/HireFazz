# HireFazz: Revolutionizing Hiring Process.

## Features:

### 1. Create Job Ads Seamlessly with AI help

### 2. Screening Hundreds of CVs Automatically in just mere minutes

### 3. One way Interview, Automatically Scoring Candidates Answer Like Magic

## Technologies Used:

- **Next.js**: A JavaScript framework for building efficient and powerful web applications.
- **TypeScript**: A strongly typed programming language that enhances code quality and scalability.
- **Trpc**: "Typescript Remote Procedure Call". It is a way of calling functions on one computer (the server) from another computer (the client). With traditional HTTP/REST APIs, you call a URL and get a response. With RPC, you call a function and get a response.
- **OpenAI**: Utilizes OpenAI's models and APIs to embed and generate conversation, images, videos, code, and music.
- **Langchain Framework**: Framework for developing applications powered by language models.
- **Pinecone**: A vector database to provide long-term memory for high-performance AI applications
- **Clerk**: Clerk provides authentication and user management functionalities to ensure a secure and customized user experience.

## Getting Started: Follow the instructions below to run this application on your local machine:

1. **Prerequisites**:

- Ensure you have [Node.js](https://nodejs.org) installed.

2. **Installation**:

- Clone this repository to your local machine.
- Open a terminal and navigate to the project directory.
- Run `npm install` to install the required dependencies.

3. **Configuration**:

- Create a `.env` file in the root directory of the project.
- Copy and paste all the variables needed from `.env.example` into `.env`
- Login to the listed platform on `.env.example` to get your env variables

4. **Starting the Application**:

- Run `npm run dev` in the terminal to start the application in development mode.
- Open your web browser and navigate to `http://localhost:3000` to access the application.

## Usage:

- Upon launching the application, users can sign up for an account or log in if they already have one.
- Users can upload document (PDF, DOCX, CSV)and chat with it right away
- Users can browse the different content generation options: Images, Videos, Code, and Music.
- Select the desired option and follow the prompts to customize and generate the content.
- Once generated, users can save or export the content in their desired file format.


## Translation (i18n) usage
> Translation file is in `translations/{lang}.json`. you can modify by screen, please provide correct key and translation in usage, or it will return the raw key. <br>
> cannot use `.` in key, so replace it with `_`

### How to Use in Client Component
```tsx
    // ..
    import { useTranslations } from 'next-intl';

    const Component = () => {
        // ...
        const t = useTranslations()
        // or
        const t = useTranslations('Screen') // to use specific namespace

        // ...
            {t('key_here')}
        // ...
    }
```

### How to Use in Server Component
```tsx
    // ..
    import { getTranslations } from 'next-intl/server';

    const ServerComponent = async () => {
        // ...
        const t = await getTranslations('Home') // Home is namespace set in i18n file

        // ...
            {t('key_here')}
        // ...
    }
```

## License: This project is licensed under the [MIT](LICENSE) license. Feel free to contribute, report issues, or suggest enhancements to make this application even better!

## Contact: For any inquiries or feedback, please reach out to the project maintainer at [kalibani.ka@gmail.com](maito:kalibani.ka@gmail.com)
