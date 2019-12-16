import { mount } from '@vue/test-utils'
import Listable from '../src/js/listable';

jest.useFakeTimers();

describe('Mobile', () => {
  test('General', () => {
    window = Object.assign(window, { innerWidth: 1200 });
    window.dispatchEvent(new Event('resize'));

    const mwrapper = mount(Listable, {
      propsData: {
        headings: [
          {
            display: "ID",
            column: "id",
          },
          {
            display: "Name",
            column: "name",
          },
          {
            display: "Surname",
            column: "surname",
          },
          {
            display: "Email",
            column: "email",
          },
          {
            display: "Description",
            column: "desc",
          },
          {
            display: "Status",
            column: "status",
          },
          {
            display: "Space indent",
            column: "indent",
          }
        ],
        data: [
          {
            id: 1,
            name: "Test",
            surname: "Tested2",
            email: "test@test.com",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: "active",
            indent: 2
          }
        ]
      }
    })
    mwrapper.setProps({ responsive: true });

    mwrapper.vm.$nextTick(() => {
      window = Object.assign(window, { innerWidth: 320 });
      window.dispatchEvent(new Event('resize'));
      mwrapper.vm.$refs.container = {
        clientWidth: 500
      }
      mwrapper.vm.$refs.table = {
        clientWidth: 600
      }
      expect(setTimeout).toHaveBeenCalled();
      jest.runAllTimers()

      mwrapper.vm.$nextTick(() => {
        expect(mwrapper.vm.$data.responsiveMode).toBe(true);
        expect(mwrapper.find('.responsive-mode').exists()).toBe(true)
        expect(mwrapper.find('.listable-td-th').exists()).toBe(true)
        mwrapper.vm.$refs.container = {
          clientWidth: 800
        }
        mwrapper.vm.$refs.table = {
          clientWidth: 600
        }
        window = Object.assign(window, { innerWidth: 820 });
        window.dispatchEvent(new Event('resize'));
        expect(setTimeout).toHaveBeenCalled();
        jest.runAllTimers()
        mwrapper.vm.$nextTick(() => {
          expect(mwrapper.find('.responsive-mode').exists()).toBe(false)
          expect(mwrapper.find('.listable-td-th').exists()).toBe(false)
        })
      })
    })
  });

  test('Checkbox', () => {
    const mwrapper = mount(Listable, {
      propsData: {
        checkbox: true,
        headings: [
          {
            display: "ID",
            column: "id",
          },
          {
            display: "Name",
            column: "name",
          }
        ],
        data: [
          {
            id: 1,
            name: "Test"
          }
        ]
      }
    })
    mwrapper.setProps({ responsive: true });

    mwrapper.vm.$nextTick(() => {
      window = Object.assign(window, { innerWidth: 320 });
      window.dispatchEvent(new Event('resize'));
      mwrapper.vm.$refs.container = {
        clientWidth: 500
      }
      mwrapper.vm.$refs.table = {
        clientWidth: 600
      }
      expect(setTimeout).toHaveBeenCalled();
      jest.runAllTimers()

      mwrapper.vm.$nextTick(() => {
        expect(mwrapper.vm.$data.responsiveMode).toBe(true);
        const tr = mwrapper.find('.listable-tr-checkbox');
        tr.find('.listable-checkbox').trigger('click');
        expect(mwrapper.emitted('checked')).toBeTruthy();
      })
    })
  });

  test('Not responsive', () => {
    window = Object.assign(window, { innerWidth: 1200 });
    window.dispatchEvent(new Event('resize'));

    const mwrapper = mount(Listable, {
      propsData: {
        headings: [
          {
            display: "ID",
            column: "id",
          },
          {
            display: "Name",
            column: "name",
          },
          {
            display: "Surname",
            column: "surname",
          },
          {
            display: "Email",
            column: "email",
          },
          {
            display: "Description",
            column: "desc",
          },
          {
            display: "Status",
            column: "status",
          },
          {
            display: "Space indent",
            column: "indent",
          }
        ],
        data: [
          {
            id: 1,
            name: "Test",
            surname: "Tested2",
            email: "test@test.com",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: "active",
            indent: 2
          }
        ]
      }
    })
    mwrapper.setProps({ responsive: false });

    mwrapper.vm.$nextTick(() => {
      window = Object.assign(window, { innerWidth: 320 });
      window.dispatchEvent(new Event('resize'));

      mwrapper.vm.$nextTick(() => {
        expect(mwrapper.find('.responsive-mode').exists()).toBe(false)
      })
    })

    mwrapper.destroy();
  });
})
