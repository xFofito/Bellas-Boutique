 
(function(){
    window.ensureToastContainer = function(containerId='bb-toast'){
        let container = document.getElementById(containerId);
        if(!container){
            container = document.createElement('div');
            container.id = containerId;
            container.style.position = 'fixed';
            container.style.right = '18px';
            container.style.bottom = '18px';
            container.style.zIndex = '1050';
            document.body.appendChild(container);
        }
        return container;
    };

    window.showToast = function(message, opts={}){
        const containerId = opts.containerId || 'bb-toast';
        const container = ensureToastContainer(containerId);
        const id = 't' + Date.now();
        const type = opts.type === 'danger' ? 'danger' : 'success';
        const actionText = opts.actionText || null;
        const action = opts.action || null;
        const duration = typeof opts.duration === 'number' ? opts.duration : 5000;

        const el = document.createElement('div');
        el.id = id;
        el.className = 'toast show';
        el.style.minWidth = '240px';
        el.style.marginTop = '8px';
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
        el.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:${type==='danger'? '#fee2e2':'#f8fafc'};">
                <div style="flex:1">
                    <div style="font-weight:700;color:${type==='danger'? '#b91c1c':'#0f1724'}">${message}</div>
                </div>
                ${actionText? `<button class="btn btn-sm btn-outline-primary" id="${id}-act">${actionText}</button>` : ''}
                <button class="btn-close" aria-label="Cerrar" id="${id}-close" style="margin-left:8px"></button>
            </div>
        `;
        container.appendChild(el);

        if(actionText && action){
            const actBtn = el.querySelector('#'+id+'-act');
            if(actBtn) actBtn.addEventListener('click', action);
        }
        el.querySelector('#'+id+'-close').addEventListener('click', ()=>{ el.remove(); });
        setTimeout(()=>{ if(document.getElementById(id)) document.getElementById(id).remove(); }, duration);
        return id;
    };

     window.setInvalid = function(inputEl, message){
        if(!inputEl) return;
        inputEl.classList.add('is-invalid');
        let next = inputEl.parentNode.querySelector('.invalid-feedback');
        if(!next){ next = document.createElement('div'); next.className = 'invalid-feedback'; inputEl.parentNode.appendChild(next); }
        next.textContent = message || '';
    };
    window.clearInvalid = function(inputEl){ if(!inputEl) return; inputEl.classList.remove('is-invalid'); const next = inputEl.parentNode.querySelector('.invalid-feedback'); if(next) next.textContent = ''; };

     window.initInputMasks = function(){
        try{
            if(typeof Cleave === 'undefined') return;
            // credit card numbers
            document.querySelectorAll('.cc-number').forEach(el=>{
                if(el.__cleave) return;
                el.__cleave = new Cleave(el, { creditCard: true, onCreditCardTypeChanged: function(type){ /*noop*/ } });
            });
             document.querySelectorAll('.cc-exp').forEach(el=>{
                if(el.__cleave) return;
                el.__cleave = new Cleave(el, { date: true, datePattern: ['m','y'] });
            });
             document.querySelectorAll('.cc-cvv').forEach(el=>{
                if(el.__cleave) return;
                el.__cleave = new Cleave(el, { numericOnly: true, blocks: [4] });
            });
             document.querySelectorAll('.phone-mask').forEach(el=>{
                if(el.__cleave) return;
                el.__cleave = new Cleave(el, { phone: true, phoneRegionCode: 'CR' });
            });
             document.querySelectorAll('.postal-mask').forEach(el=>{
                if(el.__cleave) return;
                el.__cleave = new Cleave(el, { numericOnly: true, blocks: [5] });
            });
        }catch(e){ console.warn('initInputMasks failed', e); }
    };

    document.addEventListener('DOMContentLoaded', ()=>{
         ensureToastContainer('bb-toast');
         setTimeout(()=>{ try{ initInputMasks(); }catch(e){} }, 200);
    });
})();
///UTILS