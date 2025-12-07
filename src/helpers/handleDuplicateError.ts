import { TGenericErrorResponse } from "../interfaces/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)
    
    // If regex didn't match, check for common duplicate scenarios
    let message = "Duplicate entry detected";
    
    if (matchedArray && matchedArray[1]) {
        message = `${matchedArray[1]} already exists!!`;
    } else if (err.message.includes("noteId") && err.message.includes("voterUserId")) {
        message = "You have already voted on this note. You can change your vote by voting again.";
    } else if (err.keyPattern) {
        // Extract field names from keyPattern
        const fields = Object.keys(err.keyPattern).join(", ");
        message = `Duplicate value for: ${fields}`;
    }

    return {
        statusCode: 400,
        message
    }
}