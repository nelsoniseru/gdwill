const axios = require('axios');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Function to verify BVN
const  verifyBvn = async (bvn) => {
    try {
        //https://docs.verifyme.ng/identity-verifications/bank-verification-number
        const response = await axios.get(
            `https://api.paystack.co/bank/resolve_bvn/${bvn}`, 
            
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        //  message: 'BVN must be 11 digits long',
        return response.data;
    } catch (error) {
       // console.log(error)
        console.error('Error verifying BVN:', error.response ? error.response.data : error.message);
        throw new Error('BVN verification failed');
    }
};


const  getBanks = async () => {

    try {
        // Make a request to Paystack to get the list of banks
        const response = await axios.get('https://api.paystack.co/bank', {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        // Send back the list of banks
        return response.data.data;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch banks' });
    }


}


async function resolveAccountNumber(accountNumber, bankCode) {
    try {
        const response = await axios.get('https://api.paystack.co/bank/resolve', {
            params: {
                account_number: accountNumber,
                bank_code: bankCode,
            },
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error resolving account number:', error.response?.data || error.message);
        throw new Error('Unable to resolve account number.');
    }
}

async function getBankCodeByName(bankName) {
    try {
        const response = await axios.get('https://api.paystack.co/bank', {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const banks = response.data.data;

        const bank = banks.find((b) => b.name.toLowerCase() === bankName.toLowerCase());
    return bank ? bank.code : null;
    } catch (error) {
        console.error('Error fetching bank list:', error);
        throw new Error('Unable to retrieve bank code.');
    }
}
module.exports = {verifyBvn,getBanks,resolveAccountNumber,getBankCodeByName}
