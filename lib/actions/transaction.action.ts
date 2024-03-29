"use server";


import { profile } from "console";
import Stripe from "stripe"
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";
export async function checkoutCredits(transatcion: CheckoutTransactionParams) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const amount = Number(transatcion.amount) * 100;
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: amount,
                    product_data: {
                        name: transatcion.plan,
                    }
                },
                quantity: 1
            }
        ],
        metadata: {
            plan: transatcion.plan,
            credits: transatcion.credits,
            buyerId: transatcion.buyerId,
        },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,

    })
    redirect(session.url!);
}
export async function createTransaction(transatcion: CreateTransactionParams) {
    try {
        await connectToDatabase();
        const newTransaction = await Transaction.create({
            ...transatcion, buyer: transatcion.buyerId

        })
        await updateCredits(transatcion.buyerId, transatcion.credits);
        return JSON.parse(JSON.stringify(newTransaction));
    } catch (error) {
        handleError(error)
    }
}