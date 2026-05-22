/**
 * ✅ SEO FIX: Auto-ping frontend sitemap endpoint after new content is published.
 * This tells Google & Bing to re-crawl the sitemap immediately.
 */
async function pingSitemap() {
    const configuredFrontendUrl = process.env.FRONTEND_URL;
    const isPlaceholderFrontendUrl = !configuredFrontendUrl || configuredFrontendUrl.includes('your-frontend-domain.com');
    const primaryFrontendUrl = isPlaceholderFrontendUrl
        ? (process.env.NODE_ENV === 'production'
            ? 'https://www.digitalrisemarketing.in'
            : 'http://localhost:3000')
        : configuredFrontendUrl;
    const fallbackFrontendUrl = primaryFrontendUrl.includes('localhost')
        ? 'https://www.digitalrisemarketing.in'
        : 'http://localhost:3000';
    const pingSecret = process.env.PING_SECRET;

    const attemptPing = async (frontendUrl) => {
        const res = await fetch(`${frontendUrl}/api/ping-sitemap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: pingSecret }),
            signal: AbortSignal.timeout(8000),
        });

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(`unexpected ${contentType || 'unknown content-type'} response: ${text.slice(0, 120)}`);
        }

        const data = await res.json();
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
        }

        console.log('[SEO] Sitemap ping result:', data.status || 'ok', data.note || '');
        return true;
    };

    try {
        await attemptPing(primaryFrontendUrl);
    } catch (err) {
        if (fallbackFrontendUrl && fallbackFrontendUrl !== primaryFrontendUrl) {
            try {
                await attemptPing(fallbackFrontendUrl);
                return;
            } catch (fallbackErr) {
                console.warn(`[SEO] Sitemap ping failed (non-critical) for ${primaryFrontendUrl} and fallback ${fallbackFrontendUrl}:`, fallbackErr.message);
                return;
            }
        }

        // Non-blocking — don't fail the save if ping fails
        console.warn(`[SEO] Sitemap ping failed (non-critical) for ${primaryFrontendUrl}:`, err.message);
    }
}

module.exports = { pingSitemap };
