(function() {
  // 1. Generate or retrieve Visitor UUID for robust deduplication
  function getVisitorUuid() {
    let uuid = localStorage.getItem('vokasi_visitor_uuid');
    if (!uuid) {
      // Check cookies as fallback
      const nameEQ = "vokasi_visitor_uuid=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) uuid = c.substring(nameEQ.length, c.length);
      }
    }
    
    if (!uuid) {
      // Generate new UUID
      uuid = 'v_'+Math.random().toString(36).substr(2, 9)+'_'+Date.now().toString(36);
      localStorage.setItem('vokasi_visitor_uuid', uuid);
      const d = new Date();
      d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year cookie
      document.cookie = "vokasi_visitor_uuid=" + uuid + "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax";
    }
    return uuid;
  }

  const visitorUuid = getVisitorUuid();

  // 2. Check URL for affiliate referral code (ref or aff)
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref') || urlParams.get('aff');

  if (refCode) {
    const code = refCode.trim().toUpperCase();
    
    // 3. Set Cookie: Name="vokasi_ref", Value=code, Expire=30 days
    const expiryDays = 30;
    const date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = "vokasi_ref=" + code + expires + "; path=/; SameSite=Lax";

    // 4. Set Local Storage as a robust backup (resilient to cookie clearance)
    localStorage.setItem('vokasi_ref', code);

    // 5. Clean the URL to prevent refresh duplication (URL Sanitization)
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      url.searchParams.delete('aff');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    // 6. Call server endpoint to record click event (only once per session for the same code)
    const clickTrackedKey = `vokasi_click_tracked_${code}`;
    if (!sessionStorage.getItem(clickTrackedKey)) {
      fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, visitorUuid: visitorUuid })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          sessionStorage.setItem(clickTrackedKey, 'true');
        }
      })
      .catch(err => console.error('Error tracking affiliate click:', err));
    }
  }

  // 7. Expose helper function to retrieve active referral code during checkout/signups
  window.getVokasiReferralCode = function() {
    // Check cookie
    const nameEQ = "vokasi_ref=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    // Check local storage backup
    return localStorage.getItem('vokasi_ref') || null;
  };
})();
