import PageTransition from './page-transition'

const Loading = () => {
  return (
    <PageTransition>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-btn-primary"></div>
      </div>
    </PageTransition>
  )
}

export default Loading