import { Link, FooterLinks } from "./interfaces";

export const MENUITEMS: Link[] = [{
    name: 'Home',
    link: ''
},  {
    name: 'Properties',
    link: 'properties'
}, 
{
    name: 'Contact',
    link: 'contact'
}
]

export const FOOTERLINKS: FooterLinks[] = [
    {
        title: 'Home',
        links: [
            { name: 'Hero Section', link: '#' },
            { name: 'Features', link: '#' },
            { name: 'Properties', link: '#' },
            { name: 'Testimonials', link: '#' },
            { name: `FAQ's`, link: '#' }
        ]
    },
    {
        title: 'Properties',
        links: [
            { name: 'portfolio', link: '#' },
            { name: 'Categories', link: '#' }
        ]
    },
    {
        title: 'Contact Us',
        links: [
            { name: 'Contact Form', link: '#' },
            { name: 'Our Offices', link: '#' }
        ]
    }
];

export const SOCIALMEDIA = [
    {
        name: 'Facebook',
        icon: '/images/facebook.png',
        link: '#'
    },
    {
        name: 'Twitter',
        icon: '/images/twitter.png',
        link: '#'
    },
    {
        name: 'Instagram',
        icon: '/images/youtube.png',
        link: '#'
    },
    {
        name: 'LinkedIn',
        icon: '/images/linkedin.png',
        link: '#'
    }
];

export const FEATURECARDS = [
    {
        icon: "./images/home-icon.png",
        title: "Find Dream Home",
        description: "Browse through our curated selection of premium properties to find your perfect match."
    },
    {
        icon: "./images/value-icon.png",
        title: "Property Valuation",
        description: "Get accurate market value estimates for any property with our advanced valuation tools."
    },
    {
        icon: "./images/expert-icon.png",
        title: "Expert Guidance",
        description: "Our experienced agents provide personalized support throughout your property journey."
    },
    {
        icon: "./images/secure-icon.png",
        title: "Secure Investment",
        description: "Make confident property investments with our verified listings and secure transaction process."
    }
]

export const INFOCARDS = [
    {
        count: "200+",
        text: "Happy Customers"
    },
    {
        count: "10K+",
        text: "Properties For Clients"
    },
    {
        count: "16+",
        text: "Years of Experience"
    }
]

export const PROPERTIES = [
  {
    id: 1,
    name: "Luxury Villa with Ocean View",
    location: "Miami Beach, Florida",
    description: "Stunning 5-bedroom villa with panoramic ocean views, infinity pool, and private beach access. Features modern architecture and high-end finishes.",
    price: 2850000,
    img: "/images/property1.png",
    images: [
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png"
    ]
  },
  {
    id: 2,
    name: "Modern Downtown Loft",
    location: "Manhattan, New York",
    description: "Spacious industrial-style loft with exposed brick walls, high ceilings, and floor-to-ceiling windows overlooking the city skyline.",
    price: 1750000,
    img: "/images/property2.png",
    images: [
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png"
    ]
  },
  {
    id: 3,
    name: "Mountain View Cabin",
    location: "Aspen, Colorado",
    description: "Cozy 3-bedroom cabin with breathtaking mountain views, wood-burning fireplace, and modern amenities. Perfect for ski enthusiasts.",
    price: 985000,
    img: "/images/property1.png",
    images: [
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png"
    ]
  },
  {
    id: 4,
    name: "Contemporary Smart Home",
    location: "Silicon Valley, California",
    description: "Ultra-modern 4-bedroom home with cutting-edge smart technology, solar panels, and sustainable design features.",
    price: 3200000,
    img: "/images/property2.png",
    images: [
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png"
    ]
  },
  {
    id: 5,
    name: "Historic Brownstone",
    location: "Boston, Massachusetts",
    description: "Beautifully restored 19th-century brownstone with original details, modern updates, and charming garden space.",
    price: 2100000,
    img: "/images/property3.png",
    images: [
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png"
    ]
  },
  {
    id: 6,
    name: "Waterfront Penthouse",
    location: "Seattle, Washington",
    description: "Luxurious penthouse with wraparound terrace, private elevator, and stunning views of Puget Sound and the city skyline.",
    price: 4500000,
    img: "/images/property1.png",
    images: [
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png"
    ]
  },
  {
    id: 7,
    name: "Desert Oasis Estate",
    location: "Scottsdale, Arizona",
    description: "Spectacular 6-bedroom estate with resort-style pool, outdoor kitchen, and seamless indoor-outdoor living spaces.",
    price: 3750000,
    img: "/images/property1.png",
    images: [
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png"
    ]
  },
  {
    id: 8,
    name: "Urban Micro Apartment",
    location: "San Francisco, California",
    description: "Efficiently designed studio apartment with smart storage solutions and high-end finishes in prime downtown location.",
    price: 650000,
    img: "/images/property2.png",
    images: [
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png"
    ]
  },
  {
    id: 9,
    name: "Lake House Retreat",
    location: "Lake Tahoe, Nevada",
    description: "Serene 4-bedroom lake house with private dock, expansive deck, and panoramic water views. Perfect for year-round enjoyment.",
    price: 2950000,
    img: "/images/property3.png",
    images: [
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png"
    ]
  },
  {
    id: 10,
    name: "Golf Course Estate",
    location: "Palm Springs, California",
    description: "Elegant 5-bedroom estate overlooking championship golf course with pool, spa, and outdoor entertainment area.",
    price: 3100000,
    img: "/images/property3.png",
    images: [
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png",
      "/images/property3.png",
      "/images/property1.png",
      "/images/property2.png"
    ]
  }
];