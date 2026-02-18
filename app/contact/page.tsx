import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact Us — FinnSays',
    description: 'Get in touch with FinnSays — inquire about our systematic trading solutions and technology.',
    openGraph: {
        title: 'Contact Us — FinnSays',
        description: 'Get in touch with the FinnSays team.',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Contact — FinnSays',
        description: 'Get in touch with the FinnSays team.',
    },
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
