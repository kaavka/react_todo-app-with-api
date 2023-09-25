import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todoId: number;
  prevTitle: string;
  setIsUpdating: (state: boolean) => void
}

export const ChangeTodoForm: React.FC<Props> = (
  {
    todoId,
    prevTitle,
    setIsUpdating,
  },
) => {
  const [inputValue, setInputValue] = useState(prevTitle);
  const { handleDeleteTodo, handleChangeTodo } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleError = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = inputValue.trim();

    if (trimmedTitle === prevTitle) {
      setIsUpdating(false);

      return;
    }

    if (!trimmedTitle) {
      try {
        await handleDeleteTodo(todoId);
      } catch {
        handleError();
      }

      return;
    }

    try {
      await handleChangeTodo(todoId, { title: trimmedTitle });
      setIsUpdating(false);
    } catch {
      handleError();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setInputValue(prevTitle);
      setIsUpdating(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onBlur={handleSubmit}
    >
      <input
        ref={inputRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={inputValue}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
      />
    </form>
  );
};
