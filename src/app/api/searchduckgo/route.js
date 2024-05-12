import axios from 'axios'


export async function POST(req) {

    const { data } = await req.json();

    const response = await axios.post('https://api.tavily.com/search', {
        api_key: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
        query: data
    });
    const searchData = response.data.results;
    return new Response(JSON.stringify(searchData), {
        headers: {
            "Content-Type": "application/json",
        }, 
        status: 200, // HTTP status code
    });


}
