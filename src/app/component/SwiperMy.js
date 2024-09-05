// src/components/MySwiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    title: "Purification de l'Être",
    content: "Visualiser qu'une douche de Lumière vous nettoie (intérieur et extérieur) dans toute votre colonne de Lumière qui vous relie au Ciel et à la Terre Mère. Demander dans le même temps que l'archange Saint-Michel avec sa spirale de Lumière aspire de tous les plans de votre Être toutes les entités, parasites, âmes désincarnées et énergies négatives et noires afin de les transmuter en Amour et Lumière.",
    bgColor: "bg-red-500"
  },
  {
    title: "Le pilier de Lumière",
    content: "Je demande aux guides d'etre entouré par un pilier de lumière divine impénétrable a toute entité , toute ame et  tout attaque.Amen",
    bgColor: "bg-green-500"
  },
  {
    title: "Demande d'autorisation",
    content: "Demande toi si tu es bien pret .Vérifie au pendule.",
    bgColor: "bg-green-500"
  },
  {
    title: "Le Sceau de Salomon",
    content: "J'invoque Salomon et je lui demandes qu'il place en moi et sur moi le sceau de Salomon\n\nIMAK SOUKELAMAK : Je garde ma foi et je l'inscrit sous la protection dutres haut",
    bgColor: "bg-green-500"
  },
  {
    title: "Appel des guides",
    content: "j'appelle Jésus Christ , La vierge Marie , les archanges saint michel , Gabriel , Raphael , Métatatron , Sandalphon , uriel , Jophiel et Shiva",
    bgColor: "bg-green-500"
  },
  {
    title: "Protection énergie d'amour ",
    content: "je demande a etre protégé pendant le soin et que l'enrgie d'amour vibrante et de pure lumière m'enveloppe pendant la séance de soin ",
    bgColor: "bg-blue-500"
  },
  {
    title: "Prière de coupure de liens toxiques",
    content: `Au nom de la justice divine et de la Sainte Trinité, je demande maintenant que les archanges Saint-Michel et Uriel coupent tous les liens et toutes les cordes toxiques de nature karmique, transgénérationnelle et actuelle entre …………………… (prénom nom) et …………………… (prénom nom ou lieu) afin que se repositionnent les liens d'Amour entre toutes les personnes concernées.

Je demande que ces liens coupés soient l'expression de la lumière, de la compassion et du pardon de chacun.

Au nom de la justice divine et de la Sainte Trinité, je remercie les archanges Saint-Michel et Uriel pour leur aide et leur prie de protéger désormais …………………… (prénom nom).

Amen`,
    bgColor: "bg-blue-500"
  },
  {
    title: "Prière de nettoyage des corps énergétiques",
    content: `
    Par la grâce des archanges Saint-Michel, Gabriel et Raphaël (Uriel, Shiva …), je demande que les corps énergétiques (physique, éthérique, astral, mental, causal, spirituel, divin) de …………………… (prénom nom) et l’aura de …………………… (prénom nom) dans sa globalité soit nettoyés et libérés de toute souillure, impureté (magie noire, racines de possession, implants), entités et âmes désincarnées. Que les entités et les âmes rejoignent maintenant les royaumes de l’indicible et de la lumière.

Ainsi purifié dans tout son être, …………………… (prénom nom) se remet dans l’énergie d’amour de la Source créatrice de pure Lumière.

Chers archanges Saint-Michel, Gabriel et Raphaël, je vous remercie de votre aide.

Ainsi soit-il
    `,
    bgColor: "bg-blue-500"
  },
  {
    title: "Prière de nettoyage des chakras et des organes",
    content: `
    Par la grâce des archanges Saint-Michel, Gabriel et Raphaël (Uriel, Shiva …), je demande que tous les chakras (racine, sacré, plexus solaire, cœur, gorge, 3ème œil, coronal) de …………………… (prénom nom), glandes endocrines et organes de …………………… (prénom nom) soit nettoyés et libérés de toute souillure, impureté (magie noire, racines de possession, implants), entités et âmes désincarnées. Que les entités et les âmes rejoignent maintenant les royaumes de l’indicible et de la lumière.

Ainsi purifié dans tout son être, …………………… (prénom nom) se remet dans l’énergie d’amour de la Source créatrice de pure Lumière.

Chers archanges Saint-Michel, Gabriel et Raphaël, je vous remercie de votre aide.

Ainsi soit-il
    `,
    bgColor: "bg-green-500"
  },
  {
    title: "Prière de nettoyage des chakras et des organes",
    content: `
    Par la grâce des archanges Saint-Michel, Gabriel et Raphaël (Uriel, Shiva …), je demande que tous les chakras (racine, sacré, plexus solaire, cœur, gorge, 3ème œil, coronal) de …………………… (prénom nom), glandes endocrines et organes de …………………… (prénom nom) soit nettoyés et libérés de toute souillure, impureté (magie noire, racines de possession, implants), entités et âmes désincarnées. Que les entités et les âmes rejoignent maintenant les royaumes de l’indicible et de la lumière.

Ainsi purifié dans tout son être, …………………… (prénom nom) se remet dans l’énergie d’amour de la Source créatrice de pure Lumière.

Chers archanges Saint-Michel, Gabriel et Raphaël, je vous remercie de votre aide.

Ainsi soit-il
    `,
    bgColor: "bg-green-500"
  },
];

const MySwiper = () => {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={`${slide.bgColor} text-white w-full flex justify-center h-[600px]`}>
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">{slide.title}</h1>
              <div className="text-gray-700">
                {slide.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MySwiper;