import React, {useState} from 'react'
import AuthServiceHandler from "../services/auth.service.handler";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.css'

const LoginForm = () => {

  const session = AuthServiceHandler.getUser();
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>( false);
  const [ message, setMessage ] = useState<string>('');

  const onChangeUsername = (event: any) => {
    setUsername(event.target.value);
  }

  const onChangePassword = (event: any) => {
    setPassword(event.target.value);
  }

  const handleLogin = () => {
    setMessage('');
    setLoading(true);

    AuthServiceHandler.login(username, password)
      .then(() => {
        setLoading(false);
      }, (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        setLoading(false);
        setMessage(resMessage);
      })
  }

  const handleLogOut = () => {
    AuthServiceHandler.logout();
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  })

  const { register, handleSubmit, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchema)
  });

  return (
    <div className='container'>
      <div className='col-md-12'>
        <div className='card card-container'>
          <img src='//ssl.gstatic.com/accounts/ui/avatar_2x.png' alt='profile-img' className='profile-img-card' />
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input type='text' {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} onChange={onChangeUsername} />
              {/* @ts-ignore */}
              <div className='invalid-feedback'>{errors.username?.message}</div>
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='password' {...register('password')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} onChange={onChangePassword}/>
              {/* @ts-ignore */}
              <div className='invalid-feedback'>{errors.password?.message}</div>
            </div>

            <div className='form-group' style={{ marginTop: '10px' }}>
              <button className='btn btn-primary btn-block' disabled={loading}>
                {loading && <span className='spinner-border spinner-border-sm' />}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className='form-group'>
                <div className='alert alert-danger' role='alert'>
                  {message}
                </div>
              </div>
            )}
          </form>
        </div>
        <div className='container'>
          {session && (
            <>
              <pre>{JSON.stringify(session.user)}</pre>
              <button className='btn btn-primary btn-sm' onClick={handleLogOut}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
    );
}

export default LoginForm;
