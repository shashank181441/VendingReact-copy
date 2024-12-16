import React from 'react';

const slots = Array.from({ length: 50 }, (_, index) => index + 1);
const filledSlots = [1, 5, 10, 15, 20]; // Example filled slots

const SlotTable = () => {
    return (
        <div className="mt-10 md:mt-0 md:ml-8">
            <table className="border-collapse border border-gray-300">
                <tbody>
                    {Array.from({ length: 10 }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {slots.slice(rowIndex * 5, rowIndex * 5 + 5).map((slot) => (
                                <td key={slot} className="border border-gray-300 p-2">
                                    <div
                                        className={`w-4 h-4 rounded-full mx-auto ${
                                            filledSlots.includes(slot) ? 'bg-red-500' : 'bg-gray-400'
                                        }`}
                                    ></div>
                                    <span className="block text-center">{slot}</span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SlotTable;
