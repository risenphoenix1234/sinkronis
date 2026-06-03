import Button from '../ui/Button'
export default function PageHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="h1">{title}</h1>
      {actions ?? <Button>New</Button>}
    </div>
  )
}
