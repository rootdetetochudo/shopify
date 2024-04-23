import MagicBell from "magicbell";
import type { NextApiRequest, NextApiResponse } from "next";

interface WelcomeRequest extends NextApiRequest {
  body: {
    userId: string;
  };
}

type ResponseData = {
  status: string;
};

const magicbell = new MagicBell({
  apiKey: process.env.NEXT_PUBLIC_MAGICBELL_API_KEY,
  apiSecret: process.env.MAGICBELL_API_SECRET,
});

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(
  req: WelcomeRequest,
  res: NextApiResponse<ResponseData>
) {
  const randomTotalAmounts = [11.0, 20.0, 9.0, 48.0, 32.0, 5.0, 18.0, 19.0, 52.0, 33.0, 35.0, 44.0, 23.0, 10.5];

  for (let i = 0; i < 8; i++) {
    const randomItemCount = getRandomNumber(1, 4);
    const randomAmountIndex = getRandomNumber(0, randomTotalAmounts.length - 1);
    const randomTotalAmount = randomTotalAmounts[randomAmountIndex];

    const notificationContent = `[XND SHOP] has a new order for ${randomItemCount} items totaling $${randomTotalAmount.toFixed(2)}.`;

    await sendNotification(req.body.userId, notificationContent, i * 3500); // Delay each notification by 5 seconds
  }

  res.status(200).json({ status: "success" });
}

async function sendNotification(userId: string, content: string, delay: number) {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      await magicbell.notifications.create({
        title: "Congrats!",
        content: content,
        action_url: "https://magicbell.com",
        recipients: [{ external_id: userId }],
        category: "default",
      });
      resolve();
    }, delay);
  });
}
