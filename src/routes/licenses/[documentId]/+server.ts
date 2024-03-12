
export async function GET({ params, url }) {
    // Check if params.documentId is an integer (try to parse it)
    let documentId: number;
    try {
        documentId = parseInt(params.documentId);
    } catch (e) {
        documentId = NaN;
    }

    if (isNaN(documentId)) {
        return new Response('Invalid document ID', { status: 400 });
    }

    // Fetch the document from FAA
    const faaResponse = await fetch(`https://www.faa.gov/media/${documentId}`);
    if (faaResponse.status !== 200) {
        return new Response('Document not found', { status: 404 });
    }

    const headers = new Headers(faaResponse.headers);

    // Set cache control headers to 1 hour
    headers.set('Cache-Control', 'public, max-age=3600');

    // Return the document
    return new Response(await faaResponse.blob(), { headers });
}