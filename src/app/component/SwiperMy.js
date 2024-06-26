// src/components/MySwiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Pagination, Navigation } from 'swiper';

// Installer les modules Swiper
SwiperCore.use([Pagination, Navigation]);

const MySwiper = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <div className="bg-red-500 text-white w-full flex  justify-center h-[600px]">


          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">Purification de l'Être</h1>
            <ol className="list-decimal pl-5">
              <li className="text-gray-700 mb-2">
                Visualiser qu’une douche de Lumière vous nettoie (intérieur et extérieur) dans toute votre colonne de Lumière
                qui vous relie au Ciel et à la Terre Mère. Demander dans le même temps que l’archange Saint-Michel avec sa
                spirale de Lumière aspire de tous les plans de votre Être toutes les entités, parasites, âmes désincarnées et
                énergies négatives et noires afin de les transmuter en Amour et Lumière.
              </li>
            </ol>
          </div>
        </div>
       
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-green-500 text-white w-full flex  justify-center h-[600px]">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 text-center mb-4"> Le pilier de Lumière</h1>
            <ol className="list-decimal pl-5">

              <li className="text-gray-700">

                <ul className="list-disc pl-5 mt-2">
                  
                  <li>
                    Je demande aux guides d'etre entouré par un pilier de lumière divine impénétrable a toute entité , toute ame et  tout attaque.Amen
                  </li>
                </ul>
              </li>
            </ol>
          </div>


        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-green-500 text-white w-full flex  justify-center h-[600px]">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 text-center mb-4"> Le Sceau de Salomon</h1>
            <ol className="list-decimal pl-5">

              <li className="text-gray-700">

                <ul className="list-disc pl-5 mt-2">
                  
                  <li>
                   J'invoque Salomon et je lui demandes qu'il place en moi et sur moi le sceau de Salomon
                  </li>
                  <p className='mt-2'>
                    IMAK SOUKELAMAK : Je garde ma foi et je l'inscrit sous la protection dutres haut 
                  </p>
                </ul>
              </li>
            </ol>
          </div>


        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-blue-500 text-white w-full flex  justify-center h-[600px]">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 text-center mb-4"> Le nettoyage énergétique au pendule d’une personne</h1>
            <ol className="list-decimal pl-5">

              <li className="text-gray-700">

                <ul className="list-disc pl-5 mt-2">
                  <li className="mb-2">
                    Faire tourner le pendule dans le sens inverse des aiguilles d’une montre en disant : « Chers guides
                    d’Amour et de Lumière, je vous demande de bien vouloir enlever de l’aura de ................. (prénom et
                    nom du consultant), de ses chakras, de ses corps énergétiques, de ses organes et de ses glandes endocrines
                    toute entité, entité cachée, toute âme désincarnée, tout implant, toute racine de possession et toute
                    souillure. Qu’ils soient transmutés maintenant en lumière d’Amour. Merci »
                  </li>
                 
                </ul>
              </li>
            </ol>
          </div>

        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-green-500 text-white w-full flex  justify-center h-[600px]">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 text-center mb-4"> Le nettoyage énergétique au pendule d’une personne</h1>
            <ol className="list-decimal pl-5">

              <li className="text-gray-700">

                <ul className="list-disc pl-5 mt-2">
                  
                  <li>
                    Faire tourner le pendule dans le sens des aiguilles d’une montre en disant : « Chers guides d’Amour et de
                    Lumière, je vous demande de bien vouloir fermer et sceller pour l’éternité toutes les failles, fuites,
                    trous, fissures, brèches, portes et portails présents sur et dans ................. (prénom et nom du
                    consultant) au niveau des chakras, des corps énergétiques, des organes et des glandes endocrines. Merci »
                  </li>
                </ul>
              </li>
            </ol>
          </div>


        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-yellow-500 text-white w-full  flex items-center justify-center h-[600px]">Slide 4</div>
      </SwiperSlide>
    </Swiper>
  );
};

export default MySwiper;
