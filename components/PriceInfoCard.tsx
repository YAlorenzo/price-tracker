import Image from "next/image";

interface Props {
  title: string;
  iconSrc: string;
  value: string;
  border: string;
}

const PriceInfoCard = ({ title, iconSrc, value, border }: Props) => {
  return (
    <div className={`price-info_card ${border}`}>
      <p className="text-base text-black-100">{title}</p>

      <div className="flex gap-1">
        <Image src={iconSrc} alt={title} width={24} height={24} />

        <p className="text-2xl font-bold text-secondary">{value}</p>
      </div>
    </div>
  );
};

export default PriceInfoCard;
