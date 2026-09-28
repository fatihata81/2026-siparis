const PrintLabel = ({ order }) => {
  if (!order) return null;

  return (
    <div className="print-label hidden print:block">
      <div className="border-2 border-black p-2 h-full flex flex-col justify-between text-xs">
        <div>
          <div className="text-center font-bold text-lg mb-2 border-b-2 border-black pb-1">
            SİPARİŞ #{order.order_no}
          </div>
          
          <div className="space-y-1">
            <div className="flex">
              <span className="font-semibold w-20">Müşteri:</span>
              <span className="flex-1">{order.first_name} {order.last_name}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold w-20">Telefon:</span>
              <span className="flex-1">{order.phone}</span>
            </div>
            
            <div className="border-t border-gray-300 my-1 pt-1">
              <div className="flex">
                <span className="font-semibold w-20">Ürün:</span>
                <span className="flex-1">{order.product_type}</span>
              </div>
              
              {order.base_selection && (
                <div className="flex">
                  <span className="font-semibold w-20">Altlık:</span>
                  <span className="flex-1">{order.base_selection}</span>
                </div>
              )}
              
              <div className="flex">
                <span className="font-semibold w-20">Renk:</span>
                <span className="flex-1">{order.color}</span>
              </div>
              
              {order.customization && (
                <div className="flex">
                  <span className="font-semibold w-20">Yazı:</span>
                  <span className="flex-1 break-words">{order.customization}</span>
                </div>
              )}
              
              {order.base_text && (
                <div className="flex">
                  <span className="font-semibold w-20">Altlık Yzs:</span>
                  <span className="flex-1 break-words">{order.base_text}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-300 my-1 pt-1">
              <div className="flex">
                <span className="font-semibold w-20">Kargo:</span>
                <span className="flex-1">{order.cargo_company}</span>
              </div>
              
              <div className="flex">
                <span className="font-semibold w-20">Adres:</span>
                <span className="flex-1 text-[10px]">{order.province}/{order.district} - {order.address.substring(0, 40)}{order.address.length > 40 ? '...' : ''}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-black pt-1 mt-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Ödeme:</span> {order.payment_type}
            </div>
            <div className="text-lg font-bold">
              {order.amount} ₺
            </div>
          </div>
          {order.gift_package && (
            <div className="text-center font-semibold mt-1 bg-black text-white px-2">
              HEDİYE PAKETİ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintLabel;