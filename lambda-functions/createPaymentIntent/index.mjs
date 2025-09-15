// 최종 진단용 index.mjs
console.log("Lambda cold start: File execution begins.");

import { PrismaClient } from '@prisma/client';
console.log("Successfully imported PrismaClient.");

import Stripe from 'stripe';
console.log("Successfully imported Stripe.");

let prisma;
try {
    prisma = new PrismaClient();
    console.log("PrismaClient initialized successfully.");
} catch (e) {
    console.error("CRITICAL: Failed to initialize PrismaClient.", e);
    throw new Error("Prisma initialization failed.");
}

let stripe;
try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        console.error("CRITICAL: STRIPE_SECRET_KEY environment variable is missing!");
        throw new Error("STRIPE_SECRET_KEY is missing.");
    }
    stripe = new Stripe(stripeKey);
    console.log("Stripe initialized successfully.");
} catch (e) {
    console.error("CRITICAL: Failed to initialize Stripe.", e);
    throw new Error("Stripe initialization failed.");
}

export const handler = async (event) => {
    console.log("Handler invoked.");
    try {
        const { id: ideaId } = event.pathParameters;
        const userId = event.requestContext.authorizer.userId;

        const auction = await prisma.auction.findUnique({
            where: { ideaId },
            include: { bids: { orderBy: { amount: 'desc' }, take: 1 } }
        });

        const winningBid = auction?.bids[0];
        const winningBidderId = winningBid?.bidderId;
        const isAuctionEnded = auction ? new Date() >= new Date(auction.endTime) : false;

        if (!auction || !isAuctionEnded || winningBidderId !== userId) {
            return { statusCode: 403, body: JSON.stringify({ error: 'Not authorized or auction not ended.' }) };
        }

        const amountInCents = Math.round(winningBid.amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: { ideaId: ideaId, auctionId: auction.id },
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        };
    } catch (error) {
        console.error('Handler execution error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create payment intent' }) };
    }
};