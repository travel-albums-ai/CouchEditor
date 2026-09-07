import { useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import AdjustmentsItem from '@/middleware/interface/adjustments/AdjustmentsItem';

export default function AdjustmentsToolboxItem({
  item,
}: {
  item: {
    title: string;

    list: {
      title: string;
      checked: boolean;
      onChange: (checked: boolean) => void;
      sliders: any
    }[];
  };
}) {
  const showGenetic = useAdjustmentsStoreSelector((state) => state.showGenetic)

  return (
    <>
      {(item.list || [])
        .filter(subItem => showGenetic ? subItem.checked : true)
        .map((subItem) => <AdjustmentsItem
          key={subItem.title}
          title={subItem.title}
          checked={subItem.checked}
          onChange={subItem.onChange}
          sliders={subItem.sliders}
        />)}
    </>
  );
}
