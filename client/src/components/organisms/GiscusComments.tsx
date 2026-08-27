'use client';

import Giscus from '@giscus/react';

export default function GiscusComments() {
    return (
        <div className="w-full mt-12 mb-20 border-t border-border pt-10">
            <h3 className="text-2xl font-semibold tracking-tight mb-8">Comentarios</h3>
            <Giscus
                id="comments"
                repo="KEVIN-117/society-systems-blog"
                repoId="R_kgDOM74h6A"
                category="General"
                categoryId="DIC_kwDOM74h6M4CjK6y"
                mapping="pathname"
                term="Welcome to @giscus/react component!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="preferred_color_scheme"
                lang="es"
                loading="lazy"
            />
        </div>
    );
}
