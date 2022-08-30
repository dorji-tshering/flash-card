This is my personal project built with [Next.js](https://nextjs.org/) and [Firebase](https://firebase.com/) bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## background
I was learning NextJs and I had to make sure I kept summary notes of what I have learnt so that I can refer to it anytime, anywhere and test how much I have understood the concepts and all. I didn't want to use any paid services so I thought maybe I can build a website where I can save those notes and read/write anytime. That's how I came up with the idea for the application. I tried to use as much features of the NextJs in this application like SSR, SSG, middlewares, router events, Next api, and much more. 

## Current features
- User Authentication with Firebase(via Email Password method)
- Content authorization with session cookies(via Firebase admin SDK)
- Create card/note/document and save it to the firestore database
- Choose text or code content type
- Minimal code editor and highlighter for Javascript, TypeScript, Python, and Css
- Assign your card/note to different categories which you can add during card creation
- View card/note on a slider
- If you are familiar with concept of a particular card/note, you can mark it as known
- Update the content of a card/note 
- Delete a card/note
- Delete category if there is no more card/note
- Known/Unknown filter on the homepage

## Can i get a Demo?
I have hosted the application on [Vercel](https://vercel.com) for my personal use. However, if you want to try the application as a demo, reach me via dorjitshering370@gmail.com. Since I am using the firebase free plan, I have to limit the users to not exceed the firestore storage quota, that's why I have set up my application to manually authorize the users' email if anyone wants to try the application.

## Create your own FlashCard
If you want to create your own flash card application with firebase free plan, you can do so by simply cloning this repo and setting up your firebase and environment variables. Let me know if you need any help in configurations of both firebase or environment variables via email. 

## Learn NextJS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Finally deploy your app on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
