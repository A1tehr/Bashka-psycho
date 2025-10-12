import logo from '../assets/images/logo_v1.svg';

const Logo = () => {
    return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
        </div>
    );
};

export default Logo;