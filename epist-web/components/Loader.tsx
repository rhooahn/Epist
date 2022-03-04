//Loading Spinner
export default function Loader({show}) { //show = props.show (React component)
    return show ? <div className = "loader"></div> : null;
}