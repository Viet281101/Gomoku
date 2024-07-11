import React from 'react';

interface CellProps {
	value: string | null;
	onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
	return (
		<button className="cell" onClick={onClick}>
		{value}
		</button>
	);
};

export default Cell;
