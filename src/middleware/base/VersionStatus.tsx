import SolidChip from '@/components/SolidChip';
import packageJson from '../../../package.json';

export default function VersionStatus() {

  const version = packageJson.version;

  return (
    <SolidChip
      count={version}
      label={"v"}
      variant="header"
      minWidth={80}
      fontSize={14}
      height={30}
      borderless
      tooltip={`Version: ${version}`}
    />
  )
}
