import { Navigation } from "@/components/Navigation";
import { Truck } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Over Europees Transport
            </h1>
            <p className="text-xl text-muted-foreground">
              Uw bron voor actueel nieuws over wegtransport in Europa
            </p>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <div className="glass p-8 rounded-lg">
              <h2 className="text-2xl font-bold font-serif mb-4">Onze Missie</h2>
              <p className="text-muted-foreground">
                Wij zijn toegewijd aan het leveren van actueel en relevant nieuws over de 
                Europese wegtransportsector. Van regelgeving en wetgeving tot innovaties 
                en markttrends - wij houden u op de hoogte van alles wat belangrijk is 
                voor de transportsector.
              </p>
            </div>

            <div className="glass p-8 rounded-lg">
              <h2 className="text-2xl font-bold font-serif mb-4">Wat Wij Doen</h2>
              <p className="text-muted-foreground mb-4">
                Europees Transport is een platform waar professionals uit de transportsector 
                terecht kunnen voor:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Actueel nieuws over Europese transportregelgeving</li>
                <li>Ontwikkelingen in de logistieke sector</li>
                <li>Innovaties en duurzaamheid in het wegtransport</li>
                <li>Marktanalyses en trends</li>
                <li>Praktische tips voor transportondernemers</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-lg">
              <h2 className="text-2xl font-bold font-serif mb-4">Onze Focus</h2>
              <p className="text-muted-foreground">
                Met jarenlange ervaring in de transportsector, richten wij ons op het 
                leveren van betrouwbare informatie die transportbedrijven helpt om 
                geïnformeerde beslissingen te nemen. We behandelen onderwerpen variërend 
                van cabotage en vrachtwagenheffingen tot digitalisering en groene logistiek.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
