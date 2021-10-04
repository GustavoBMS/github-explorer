import React, {useState, useEffect, FormEvent} from 'react';
import {FiChevronRight} from 'react-icons/fi';
import {Link} from 'react-router-dom';
import api from '../../services/api';

import {Title, Form, Repositories, Error} from './styles';

import logoImg from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  //Verifica se tem alguma repositorio no localStorage
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@gitApp:repositories');

    if(storagedRepositories){
      return JSON.parse(storagedRepositories);
    }else{
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@gitApp:repositories', JSON.stringify(repositories));
  }, [repositories]);

  //Funcao para buscar repositorios a partir do formulario
  async function handleAddRepository(event:FormEvent<HTMLFormElement>):Promise<void> {
    event.preventDefault();

    if(!newRepo){
      return setInputError('Digite o autor/nome do repositório');
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;
  
      //Adiciona primeiro os repos ja existentes e depois adiciona um novo
      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    }catch(err){
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Logo" />
      <Title>Explore repositórios no Github</Title>

      {/* {!! faz com que inverta o booleano de inputError} */}
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input 
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o autor/nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {/*input que mostra se tem erro ou nao na busca do repositorio */}
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`repositories/${repository.full_name}`}>
            <img 
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard;