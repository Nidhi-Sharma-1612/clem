export const site = {
  name: "Historic George Hotel",
  shortName: "The George",
  tagline: "Boutique charm and modern comfort in the heart of Klamath Falls",
  description:
    "Boutique suites in a restored 1930s landmark in downtown Klamath Falls, Oregon. Walk to restaurants, parks and the Amtrak station — and Crater Lake is an easy day trip.",
  url: "https://historicgeorgehotel.com",
  location: "Downtown Klamath Falls, Oregon",
  city: "Klamath Falls, OR",
  email: "elgazzarc@gmail.com",
  phone: "+1 (925) 548-2779",
  phoneHref: "tel:+19255482779",
  checkIn: "3:00 PM",
  checkOut: "11:00 AM",
  coords: { lat: 42.2279876, lng: -121.7787547 },
};

export const navLinks = [
  { href: "/suites", label: "Suites" },
  { href: "/about", label: "Our Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/explore", label: "Klamath Falls" },
  { href: "/contact", label: "Contact" },
];

/** Shown wherever we nudge guests to book on this site rather than an OTA. */
export const bookDirectPerks = [
  { title: "Best rate guaranteed", body: "The lowest price for every suite is always here." },
  { title: "No Airbnb fees", body: "Skip the platform service fee entirely." },
  { title: "Free early check-in", body: "Whenever the suite is ready ahead of time." },
];

export const houseRules = {
  checkIn: "3:00 PM",
  checkOut: "11:00 AM",
  rules: ["No pets", "No smoking inside", "Easy self check-in", "On-site laundry ($2 per load)"],
  cancellation: [
    "100% refund up to 14 days before arrival",
    "50% refund up to 7 days before arrival",
    "No refund within 7 days of arrival",
  ],
};
