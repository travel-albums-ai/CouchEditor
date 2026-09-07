import IndexerContent from '@/components/IndexerContent';
import IndexerPerformancePopover from '@/components/IndexerPerformancePopover';
import IndexerSettings from '@/components/IndexerSettings';

export default function IndexerPopover() {

  return <>
    <IndexerSettings />
    <IndexerPerformancePopover />
    <IndexerContent />
  </>
}
