const data = [
  {
    picture:
      "https://media.licdn.com/dms/image/v2/C560BAQHTvZwCx4p2Qg/company-logo_200_200/company-logo_200_200/0/1630640869849/amazon_logo?e=1740614400&v=beta&t=8m7Ud_F_JBYeg6dn7tdv1tFCrkED0bjrngSPYCBiRQs",
    company: "Amazon",
    description:
      "Together, Amazonians research and develop new technologies from Amazon Web Services to Alexa on behalf of our customers: shoppers, sellers, content creators, and developers around the world",
  },
  {
    picture:
      "https://media.licdn.com/dms/image/v2/C560BAQE88xCsONDULQ/company-logo_200_200/company-logo_200_200/0/1630652622688/microsoft_logo?e=1740614400&v=beta&t=ZE_0cmbrOmEN5IYrtYUbc6D3NliZaqnh-twVx3Cfg5w",
    company: "Microsoft",
    description:
      "Every company has a mission. What's ours? To empower every person and every organization to achieve more.",
  },
  {
    picture:
      "https://media.licdn.com/dms/image/v2/C4E0BAQEVb0ZISWk8vQ/company-logo_200_200/company-logo_200_200/0/1631355051964?e=1740614400&v=beta&t=YNeLSUlqaMzxhqDJUn-65jlo_rfUmfhBry7nhhOpQzs",
    company: "Netflix",
    description:
      "Netflix is one of the world's leading entertainment services with over 270 million paid memberships in over 190 countries enjoying TV series, films and games across a wide variety of genres and languages. ",
  },
  {
    picture:
      "https://media.licdn.com/dms/image/v2/C4E0BAQFdNatYGiBelg/company-logo_200_200/company-logo_200_200/0/1636138754252/facebook_logo?e=1740614400&v=beta&t=_vh233pR6i0ftwHBLn9KtlduputHGFRqx8oal8hATuk",
    company: "Meta",
    description:
      "Meta's mission is to build the future of human connection and the technology that makes it possible.",
  },
  {
    picture:
      "https://media.licdn.com/dms/image/v2/C4D0BAQHiNSL4Or29cg/company-logo_200_200/company-logo_200_200/0/1631311446380?e=1740614400&v=beta&t=QCA5qatwhey-zzSlrW4kpkgty4U_Bu7uKgXj_PcR8aM",
    company: "Google",
    description:
      "A problem isn't truly solved until it's solved for all. Googlers build products that help create opportunities for everyone, whether down the street or across the globe.",
  },
  {
    picture:
      "https://media.licdn.com/dms/image/v2/C560BAQEbqLQ-JE0vdQ/company-logo_200_200/company-logo_200_200/0/1630604387686/spacex_logo?e=1740614400&v=beta&t=YpKTq7-y8GwuZ20F-f98FsJG8K8hntI5tov2Jh-m6-8",
    company: "SpaceX",
    description:
      "SpaceX designs, manufactures and launches the world’s most advanced rockets and spacecraft.",
  },
  {
    picture:
      "https://media.licdn.com/dms/image/v2/D560BAQH7YExLMK6L2Q/company-logo_200_200/company-logo_200_200/0/1724879902635/nvidia_logo?e=1740614400&v=beta&t=M2ooEZydXxZ0G7RUl-29sGZiiFPjQADUwM7CtqtGwBs",
    company: "NVIDIA",
    description:
      "Since its founding in 1993, NVIDIA (NASDAQ: NVDA) has been a pioneer in accelerated computing.",
  },
];

import { useState, useEffect } from "react";

interface Company {
  picture: string;
  company: string;
  description: string;
}

const Promoted = () => {
  const [loading, setLoading] = useState(true);
  const [randomCompany, setRandomCompany] = useState<Company[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const shuffledData: Company[] = data
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setRandomCompany(shuffledData);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="bg-white items-center border border-neutral-300 rounded-lg overflow-hidden cursor-default h-fit">
      <p className="font-semibold pt-2 pl-6">Promoted</p>
      <div className="flex justify-center h-fit">
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="w-40 h-[18rem] mt-2 flex flex-col justify-center items-center text-center bg-white animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded mt-3"></div>
                <div className="w-2/3 h-3 bg-gray-300 rounded mt-2"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded mt-auto mb-3"></div>
              </div>
            ))
          : randomCompany.map((company, index) => (
              <div
                key={index}
                className={`w-40 h-[18rem] mt-2 flex flex-col justify-center items-center text-center ${
                  index < randomCompany.length - 1 ? "border-r" : ""
                }`}
              >
                <img
                  src={company.picture}
                  alt={company.description}
                  className="w-20 h-20"
                />
                <p className="text-sm font-semibold px-2">{company.company}</p>
                <p className="text-xs px-2 mb-3">{company.description}</p>
                <p className="mt-auto mb-3 text-[#0072b1] font-semibold">
                  Learn more
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Promoted;
