import { Button, Upload } from 'antd'

type VideoUploadProps = React.HtmlHTMLAttributes<HTMLElement> & {
  disabled: boolean
  onChange: (videoFile: any) => void
  onRemove: () => void
}

export function VideoUpload({
  disabled,
  onChange = (videoFile: any) => {},
  onRemove = () => {},
}: VideoUploadProps) {
  return (
    <>
      <Upload
        disabled={disabled}
        beforeUpload={() => {
          return false
        }}
        accept="video/*"
        onChange={(info) => {
          if (info.fileList && info.fileList.length > 0) {
            onChange(info.fileList[0].originFileObj)
          }
        }}
        showUploadList={false}
      >
        <Button className="dark:invert">Upload Video</Button>
      </Upload>
      <Button
        className="text-foreground disabled:dark:invert"
        danger={true}
        disabled={!disabled}
        onClick={() => {
          onRemove()
        }}
      >
        Remove
      </Button>
    </>
  )
}
