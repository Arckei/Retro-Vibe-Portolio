import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { CERTIFICATIONS } from "@/data";

const EASE = [0.16, 1, 0.3, 1];

export default function Certifications() {
    return (
        <section
            id="certs"
            className="relative px-6 md:px-12 lg:px-24 py-24 md:py-32 lg:py-40 bg-[#0A0A0A]"
            data-testid="certifications-section"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className="mb-16 md:mb-24"
            >
                <p className="font-pixel text-[10px] text-[#FFD700] mb-6">
                    &gt; VERIFY CREDENTIALS.LOG
                </p>
                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight">
                    EARNED
                    <span className="text-outline-cyan ml-4">CREDENTIALS</span>
                </h2>
            </motion.div>

            <div className="space-y-10">
                {CERTIFICATIONS.map((cert, i) => (
                    <motion.article
                        key={cert.id}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
                        className="group grid md:grid-cols-12 bg-[#0F0F13] border border-[#27272A] hover:border-[#FFD700] hover:shadow-[0_0_35px_rgba(255,215,0,0.2)] transition-colors duration-500"
                        data-testid={`cert-card-${cert.id}`}
                    >
                        <div className="relative md:col-span-5 h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-[#27272A]">
                            <img
                                src={cert.image}
                                alt={`${cert.title} certificate`}
                                className="w-full h-full object-cover object-top saturate-[0.75] group-hover:saturate-100 group-hover:scale-[1.03] transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                            <span className="absolute top-4 left-4 font-pixel text-[9px] text-[#FFD700] bg-[#050505]/80 px-3 py-2">
                                CERT_0{cert.id}
                            </span>
                        </div>

                        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-[#FFD700] text-xs tracking-[0.25em]">
                                <Award size={16} />
                                {cert.issuer.toUpperCase()}
                            </div>
                            <h3 className="mt-5 font-display font-bold text-2xl md:text-3xl tracking-tight group-hover:text-[#FFD700] transition-colors duration-500">
                                {cert.title}
                            </h3>
                            <p className="mt-4 text-sm text-[#A1A1AA]">
                                COMPLETED: <span className="text-[#00F0FF]">{cert.date}</span>
                            </p>
                            <div className="mt-8">
                                <a
                                    href={cert.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 border border-[#FFD700] text-[#FFD700] px-6 py-3 text-xs tracking-[0.25em] hover:bg-[#FFD700] hover:text-[#050505] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-colors duration-300"
                                    data-testid={`cert-view-${cert.id}`}
                                >
                                    VIEW CERTIFICATE
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
