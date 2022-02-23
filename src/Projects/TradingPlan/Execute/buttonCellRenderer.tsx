export default props => {
  console.log(props)

  const buttonClicked = () => {
    alert('yeay!')
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded; text-xs rounded-sm"
      onClick={() => buttonClicked()}
    >
      Execute
    </button>
  )
}
